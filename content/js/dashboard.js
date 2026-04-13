/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 99.43181818181819, "KoPercent": 0.5681818181818182};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5426065162907269, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/6e160715-f21f-4c82-bcbf-69b0c3ca0f44"], "isController": false}, {"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/715dc1a5-029b-4706-ab70-f260b9f1b520"], "isController": false}, {"data": [0.4791666666666667, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/25b82887-6c5c-4c87-811f-170cbc38659f"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/159fa9a6-4148-45f2-93ba-8ed1a5962dbd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/3999db39-2987-4d6c-8023-36999c24c5cd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.0, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.5833333333333334, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/4fb23f78-0891-4881-a9d2-79416fa37a30"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/48a18147-9a2e-4e13-9a76-9efbac8ea189"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/b16c104a-376c-4960-9a96-4d3b031152cb"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/4f73105b-aaf0-45b2-bc3b-c6c88b973d0c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/773f288a-db97-46f4-93b1-222eadcd5e9b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.0, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 352, 2, 0.5681818181818182, 6879.954545454541, 82, 60090, 496.5, 23868.3, 27691.349999999988, 53166.14999999966, 1.3870336001008752, 255.5115198964946, 1.0056078258543852], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/6e160715-f21f-4c82-bcbf-69b0c3ca0f44", 1, 0, 0.0, 18097.0, 18097, 18097, 18097.0, 18097.0, 18097.0, 18097.0, 0.055257777532187656, 0.01764579419240758, 0.03297119342985025], "isController": false}, {"data": ["see books", 24, 0, 0.0, 42453.20833333334, 28291, 52641, 42259.0, 50389.5, 52256.5, 52641.0, 0.10257944564357917, 123.43749582603166, 0.5043823328275596], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 5, 0, 0.0, 177.6, 174, 180, 179.0, 180.0, 180.0, 180.0, 0.03347795811237881, 0.05188429641049333, 0.0752927124343832], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 2, 0, 0.0, 23915.5, 21304, 26527, 23915.5, 26527.0, 26527.0, 26527.0, 0.020834852541331137, 0.016175495869490485, 0.007406138989301304], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 5, 0, 0.0, 245.0, 172, 519, 177.0, 519.0, 519.0, 519.0, 0.028457922116358753, 0.04410422109244271, 0.06400253382224043], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 2, 0, 0.0, 116.0, 101, 131, 116.0, 131.0, 131.0, 131.0, 0.03189385724309498, 0.023702368517573517, 0.01600922131147541], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 2, 0, 0.0, 87.0, 85, 89, 87.0, 89.0, 89.0, 89.0, 0.031915742439958504, 0.008539954520067023, 0.018201946860288837], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 2, 0, 0.0, 86.0, 83, 89, 86.0, 89.0, 89.0, 89.0, 0.031915742439958504, 0.008602289954520068, 0.018762965770366232], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 2, 0, 0.0, 85.5, 85, 86, 85.5, 86.0, 86.0, 86.0, 0.03191777979923716, 0.008602839086513141, 0.018795333221621104], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/715dc1a5-029b-4706-ab70-f260b9f1b520", 1, 0, 0.0, 22678.0, 22678, 22678, 22678.0, 22678.0, 22678.0, 22678.0, 0.044095599259193936, 0.014081309529059, 0.026310948386101065], "isController": false}, {"data": ["https://demoqa.com/books", 24, 0, 0.0, 1251.0416666666667, 661, 1546, 1264.5, 1422.0, 1519.5, 1546.0, 0.12741829301960117, 152.4365762173756, 0.25160135594300154], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/25b82887-6c5c-4c87-811f-170cbc38659f", 1, 0, 0.0, 18464.0, 18464, 18464, 18464.0, 18464.0, 18464.0, 18464.0, 0.054159445407279024, 0.01729505727361352, 0.032315840960788565], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 10, 0, 0.0, 39651.8, 32665, 47740, 39398.0, 47326.6, 47740.0, 47740.0, 0.11206365215442371, 0.03633313722194206, 0.05055996806185914], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 4, 0, 0.0, 86.5, 84, 89, 86.5, 89.0, 89.0, 89.0, 0.03526341773044644, 0.009435719197404612, 0.020111167924395233], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 1, 0, 0.0, 85.0, 85, 85, 85.0, 85.0, 85.0, 85.0, 11.76470588235294, 3.170955882352941, 6.927849264705882], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 4, 0, 0.0, 88.25, 85, 91, 88.5, 91.0, 91.0, 91.0, 0.03526155256615949, 0.026205118655124385, 0.017699646502935523], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 1, 0, 0.0, 89.0, 89, 89, 89.0, 89.0, 89.0, 89.0, 11.235955056179774, 3.028441011235955, 6.605512640449438], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 4, 0, 0.0, 85.0, 82, 89, 84.5, 89.0, 89.0, 89.0, 0.035264350386585444, 0.009504844440134356, 0.020766018831163108], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 4, 0, 0.0, 87.25, 85, 93, 85.5, 93.0, 93.0, 93.0, 0.03526310685602955, 0.009504509269789215, 0.020730849929032995], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/159fa9a6-4148-45f2-93ba-8ed1a5962dbd", 1, 0, 0.0, 21304.0, 21304, 21304, 21304.0, 21304.0, 21304.0, 21304.0, 0.04693954187007135, 0.014989482608899738, 0.02800787117442734], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 2, 0, 0.0, 86.5, 83, 90, 86.5, 90.0, 90.0, 90.0, 0.03196522183863956, 0.00861562619869582, 0.01879205424498146], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 2, 0, 0.0, 86.0, 86, 86, 86.0, 86.0, 86.0, 86.0, 0.03196368924901312, 0.008615213117898068, 0.018822367790190343], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 2, 0, 0.0, 84.5, 83, 86, 84.5, 86.0, 86.0, 86.0, 0.03196368924901312, 0.023754265154784165, 0.01604427370507104], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 1, 0, 0.0, 83.0, 83, 83, 83.0, 83.0, 83.0, 83.0, 12.048192771084338, 3.223832831325301, 6.871234939759036], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 2, 0, 0.0, 86.5, 85, 88, 86.5, 88.0, 88.0, 88.0, 0.03196266760423825, 0.008552510667540312, 0.018228708868042127], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 1, 0, 0.0, 84.0, 84, 84, 84.0, 84.0, 84.0, 84.0, 11.904761904761903, 8.847191220238095, 5.97563244047619], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 1, 0, 0.0, 11986.0, 11986, 11986, 11986.0, 11986.0, 11986.0, 11986.0, 0.0834306691139663, 0.06566906182212581, 0.029656995661605203], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 10, 0, 0.0, 23330.9, 14210, 31911, 24402.0, 31793.1, 31911.0, 31911.0, 0.12439203393414686, 0.0643825956885721, 0.057215476545882], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 1, 0, 0.0, 174.0, 174, 174, 174.0, 174.0, 174.0, 174.0, 5.747126436781609, 8.906923491379311, 12.925422054597702], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3999db39-2987-4d6c-8023-36999c24c5cd", 1, 0, 0.0, 20009.0, 20009, 20009, 20009.0, 20009.0, 20009.0, 20009.0, 0.0499775101204458, 0.015959615048228296, 0.029820565120695686], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 5, 0, 0.0, 87.0, 85, 88, 87.0, 88.0, 88.0, 88.0, 0.033498593059091517, 0.024894950505828756, 0.0168147234691143], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 5, 0, 0.0, 86.0, 84, 91, 85.0, 91.0, 91.0, 91.0, 0.033497470940943956, 0.008963190466619772, 0.019104026396007102], "isController": false}, {"data": ["addBook", 3, 2, 66.66666666666667, 94859.33333333333, 93133, 97675, 93770.0, 97675.0, 97675.0, 97675.0, 0.027233115468409584, 32.74390304443537, 0.09302874795751634], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 2, 0, 0.0, 84.5, 84, 85, 84.5, 85.0, 85.0, 85.0, 0.019363146123982225, 0.014389994336279759, 0.009719391706764516], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 2, 0, 0.0, 90.5, 86, 95, 90.5, 95.0, 95.0, 95.0, 0.01936127164832186, 0.005180652765273623, 0.01104197523693356], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 2, 0, 0.0, 92.0, 86, 98, 92.0, 98.0, 98.0, 98.0, 0.01936052195967203, 0.005218265684442853, 0.011381869355197817], "isController": false}, {"data": ["https://demoqa.com/books-0", 24, 0, 0.0, 293.0, 88, 382, 270.0, 362.0, 377.25, 382.0, 0.12780709648903255, 0.09498164104311893, 0.06178175074421008], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 2, 0, 0.0, 94.0, 83, 105, 94.0, 105.0, 105.0, 105.0, 0.019359210144226115, 0.005217912109185945, 0.011400003629851902], "isController": false}, {"data": ["https://demoqa.com/books-3", 24, 0, 0.0, 637.4166666666666, 426, 830, 670.5, 753.5, 811.0, 830.0, 0.1277914443627999, 37.57492771796428, 0.06427011117855659], "isController": false}, {"data": ["https://demoqa.com/books-1", 24, 0, 0.0, 171.95833333333331, 83, 341, 92.5, 303.0, 340.75, 341.0, 0.12801843465459026, 0.2265326206973804, 0.0622589652910019], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 5, 0, 0.0, 88.2, 84, 91, 90.0, 91.0, 91.0, 91.0, 0.03349881749174254, 0.009028978152071232, 0.019693640751981458], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 6, 0, 0.0, 572.0, 83, 1135, 545.5, 1135.0, 1135.0, 1135.0, 0.066933657589719, 30.122531734223177, 0.03647361419439765], "isController": false}, {"data": ["https://demoqa.com/books-2", 24, 0, 0.0, 955.0416666666669, 572, 1141, 991.5, 1074.5, 1127.5, 1141.0, 0.12769285611675385, 114.89825639395374, 0.06409582816797996], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 5, 0, 0.0, 16191.2, 11972, 28973, 13034.0, 28973.0, 28973.0, 28973.0, 0.027198006930052167, 0.020318823536611238, 0.00966804152591698], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 5, 0, 0.0, 87.0, 84, 90, 87.0, 90.0, 90.0, 90.0, 0.03349769535855933, 0.009028675702111693, 0.019725693653526635], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 6, 0, 0.0, 320.33333333333337, 82, 669, 293.5, 669.0, 669.0, 669.0, 0.06734006734006734, 9.909182975589227, 0.036760837542087546], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 30, 2, 6.666666666666667, 24893.766666666666, 14535, 60090, 22273.0, 55903.00000000007, 60088.35, 60090.0, 0.12609439426354568, 0.5350843532093125, 0.04754398986831542], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 2, 0, 0.0, 21914.0, 18633, 25195, 21914.0, 25195.0, 25195.0, 25195.0, 0.0235507459698786, 0.018238028861439187, 0.008371554231480283], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4fb23f78-0891-4881-a9d2-79416fa37a30", 1, 0, 0.0, 19848.0, 19848, 19848, 19848.0, 19848.0, 19848.0, 19848.0, 0.050382910116888356, 0.016089073836154776, 0.030062459063885532], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 2, 0, 0.0, 181.0, 171, 191, 181.0, 191.0, 191.0, 191.0, 0.01934329513032545, 0.029978329464674307, 0.04350352410658156], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 4, 0, 0.0, 18354.75, 13528, 27103, 16394.0, 27103.0, 27103.0, 27103.0, 0.03146509341199607, 0.02553466076696165, 0.011184857423795477], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/48a18147-9a2e-4e13-9a76-9efbac8ea189", 1, 0, 0.0, 17925.0, 17925, 17925, 17925.0, 17925.0, 17925.0, 17925.0, 0.05578800557880056, 0.017815115062761507, 0.033287569735006975], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 6, 0, 0.0, 171.16666666666666, 84, 264, 170.0, 264.0, 264.0, 264.0, 0.06765213273348443, 0.050276633799005516, 0.0339581994384873], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 10, 0, 0.0, 22326.3, 16601, 27517, 22662.5, 27352.2, 27517.0, 27517.0, 0.13288683357252964, 0.08162677570031361, 0.06008457416414182], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 6, 0, 0.0, 143.33333333333334, 84, 263, 87.5, 263.0, 263.0, 263.0, 0.06752574418997243, 0.0687786632716223, 0.03567522227224129], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b16c104a-376c-4960-9a96-4d3b031152cb", 1, 0, 0.0, 16329.0, 16329, 16329, 16329.0, 16329.0, 16329.0, 16329.0, 0.06124073733847755, 0.019556368271173984, 0.03654110401739237], "isController": false}, {"data": ["login", 10, 0, 0.0, 65729.4, 56505, 77831, 66036.0, 77417.6, 77831.0, 77831.0, 0.08965554340224857, 0.13010560302318494, 0.13527130327780668], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593275846", 2, 0, 0.0, 205.0, 191, 219, 205.0, 219.0, 219.0, 219.0, 0.03184814803019204, 0.04935840910538552, 0.07162723136087136], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 5, 0, 0.0, 20621.6, 15740, 24956, 21688.0, 24956.0, 24956.0, 24956.0, 0.029502180211117602, 0.02388408925294579, 0.010487103121920709], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4f73105b-aaf0-45b2-bc3b-c6c88b973d0c", 1, 0, 0.0, 23694.0, 23694, 23694, 23694.0, 23694.0, 23694.0, 23694.0, 0.04220477758082215, 0.013477502215750824, 0.025182733497931965], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 2, 0, 0.0, 174.5, 172, 177, 174.5, 177.0, 177.0, 177.0, 0.03191828917969997, 0.049467114187679545, 0.07178498045004789], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 2, 0, 0.0, 24206.5, 22901, 25512, 24206.5, 25512.0, 25512.0, 25512.0, 0.01662565671344018, 0.013784357958701868, 0.005909901409855689], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 6, 0, 0.0, 745.8333333333334, 171, 1400, 719.0, 1400.0, 1400.0, 1400.0, 0.06686801368565347, 40.05051190598915, 0.14183332590355405], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 6, 0, 0.0, 18080.5, 12417, 27952, 15571.5, 27952.0, 27952.0, 27952.0, 0.058891080945790764, 0.04572110288271841, 0.02093393892994906], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/773f288a-db97-46f4-93b1-222eadcd5e9b", 1, 0, 0.0, 22374.0, 22374, 22374, 22374.0, 22374.0, 22374.0, 22374.0, 0.04469473496022169, 0.014272635089836418, 0.0266684404889604], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 4, 0, 0.0, 177.5, 172, 185, 176.5, 185.0, 185.0, 185.0, 0.035234529839242454, 0.05460663950671658, 0.07924328341774939], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 5, 0, 0.0, 121.6, 84, 264, 86.0, 264.0, 264.0, 264.0, 0.028499284667954834, 0.021179644172181277, 0.014305304999344515], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 5, 0, 0.0, 85.6, 83, 90, 84.0, 90.0, 90.0, 90.0, 0.028499122227035406, 0.007625741689655959, 0.01625340564510613], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 5, 0, 0.0, 120.0, 86, 255, 86.0, 255.0, 255.0, 255.0, 0.028472020545410027, 0.007674099287630047, 0.01673843395345394], "isController": false}, {"data": ["register", 10, 0, 0.0, 39651.8, 32665, 47740, 39398.0, 47326.6, 47740.0, 47740.0, 0.12334562678080249, 0.03999096493283831, 0.055650077707744876], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 5, 0, 0.0, 118.8, 84, 244, 90.0, 244.0, 244.0, 244.0, 0.028473641949647212, 0.00767453630674085, 0.01676719345277077], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["504/Gateway Time-out", 2, 100.0, 0.5681818181818182], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 352, 2, "504/Gateway Time-out", 2, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 30, 2, "504/Gateway Time-out", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
