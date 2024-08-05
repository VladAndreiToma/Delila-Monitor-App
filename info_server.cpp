// This is a mobile container of data. Server that stores data
// dev: Vlad Andrei Toma , GDED , DAQ Team
// make this ROOT server container communicate with a javascript code via json format to send data to 
// a web page in order to monitor histograms
#include "THttpServer.h"
#include "TH1F.h"
#include <fstream>
#include <random>
#include "TROOT.h"
#include "TRandom.h"
#include <iostream>

// declaring a filler flag to know to fill or not the histograms
Bool_t fillTheHistograms = kTRUE;

// avoidance of using namespace std since it can generate conflicts in variable naming
// just use standard inheritence constructor methods std :: whatever ...

// function that that constructs a random int engine and returns a random int value ---------------------------------------
int Random_Generator_Engine_Mean(){
    // setup an existing random engine
    std::random_device rd;
    std::mt19937 gen( rd() );

    // create interval for mean values  
    int minLimitMean = 1;
    int maxLimitMean = 9;

    // setup a distribution for mean values
    std::uniform_int_distribution<> distribution( minLimitMean , maxLimitMean );
    
    // get value
    int randomGeneratedNumber = distribution( gen );
    
    return randomGeneratedNumber;
}
// usage: to generate the base of a gaussian distribution which i want an int value
// -------------------------------------------------------------------------------------------------------------------------

// function that creates a float random engine and returns a float value ---------------------------------------------------
float Random_Generator_Engine_Sigma(){
    //setup engine
    std::random_device rd;
    std::mt19937 gen( rd() );

    //create interval for mean values
    float minLimitSigma = 0.5;
    float maxLimitSigma = 5.5;

    // setup a distribution to be used
    std::uniform_real_distribution<float> distribution( minLimitSigma , maxLimitSigma );

    // get value
    float randomGeneratedNumber = distribution( gen );

    return randomGeneratedNumber;
}
// usage: to generate a float sigma for the gaussian distribution
// -------------------------------------------------------------------------------------------------------------------------


int extractNumberFromString(const std::string& str) {
    // Find the position of the first digit in the string
    size_t startPos = str.find_first_of("0123456789");
    if (startPos == std::string::npos) {
        // No digits found in the string
        return -1; // or throw an exception, depending on your requirements
    }

    // Find the position of the first non-digit character after the digits
    size_t endPos = str.find_first_not_of("0123456789", startPos);
    if (endPos == std::string::npos) {
        // If no non-digit characters found, consider the string from startPos to the end
        return std::stoi(str.substr(startPos));
    } else {
        // Extract the substring containing the number and convert it to an integer
        return std::stoi(str.substr(startPos, endPos - startPos));
    }
}

// function that constructs the structure of histograms and the histograms in the specified server given by a server* object/pointer to its class --------------------
void Create_Store_Histo( THttpServer* ServerObject , std::string& boardDirectory ,int NoOfChannels , std::vector<TH1F*>& histogramVector ){

    int bNo = extractNumberFromString( boardDirectory );
    int histLimit = NoOfChannels; // decide how many histograms you want to have
    std :: cout << "Hist limit is : " << histLimit << std::endl;
    for ( int histCounter = 0 ; histCounter < histLimit ; ++histCounter ){
        histogramVector . push_back( new TH1F( Form( "Hist_Board%d_Channel_%d" , bNo , histCounter ) , Form( "Hist_Board%d_Channel%d" , bNo ,histCounter ) , 100 , 0. , 10. ));   
        ServerObject -> Register( ( "histos/" + std::string( histogramVector[ histogramVector . size() - 1 ] -> GetTitle() ) ) . c_str() , histogramVector[ histogramVector . size() - 1 ] );
    }
    // creating dynamically the array of histograms and naming them accordingly with the iteration
}

void Fill_ExistingHistograms( THttpServer* thisServerObject , std::vector<TH1F*> histogramVector ){
    while( kTRUE ){
        for( TH1F* histObjectIterator : histogramVector ){
            int dataLimit = 5000;
            for(  int dataCounter = 0; dataCounter < dataLimit ; ++ dataCounter ){
                histObjectIterator -> Fill( gRandom -> Gaus( Random_Generator_Engine_Mean() , Random_Generator_Engine_Sigma() ) );
            }
            gSystem -> ProcessEvents();
        }
        gSystem -> ProcessEvents();
        sleep( 1 );
    }
}
// usage: manipulate the structure of the server and its content
// -------------------------------------------------------------------------------------------------------------------------------------------------------------------

// function that create the boards subfolders in which the histograms will be stored
void Create_Boards_Subdirs( THttpServer* ServerObject ){
    
    const int boardsInExperiment = 4;     // consider 7 boards in experiment
    std::array<int , boardsInExperiment> theChannelsOfBoards = { 8 , 16 , 32 , 128 };         // index is boardNo content is channels of that board
    int boardNo = 0;

    std :: vector<TH1F*> testExperimentHistogramVector;

    for( int channels : theChannelsOfBoards ){
        std::string theBoardDirectory = "board" + std::to_string(boardNo);    
        Create_Store_Histo( ServerObject , theBoardDirectory , channels , testExperimentHistogramVector );
        boardNo ++;
    }

    Fill_ExistingHistograms( ServerObject , testExperimentHistogramVector );
}

// the main function --- has the same name as the macro thut ROOT compiler can do its job without errors
void info_server()
{

    THttpServer* myServer = new THttpServer( "http:8081" );
    myServer -> SetCors("*");
    myServer -> RegisterCommand( "/Start" , "fillTheHistograms=KTRUE;" , "button;rootsys/icons/ed_execute.png" );
    myServer -> RegisterCommand( "/Stop" , "fillTheHistograms=KFALSE;" , "button;rootsys/icons/ed_interrupt.png" );

    Create_Boards_Subdirs( myServer );
    //delete myServer;
}
