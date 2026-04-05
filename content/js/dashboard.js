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

    var data = {"OkPercent": 97.91183294663573, "KoPercent": 2.0881670533642693};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.76657824933687, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.018518518518518517, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b0bce2a8-384f-4e96-bff3-335b87503bf5"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=095b8517-bf59-450e-9cad-8bd9023e4eab"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9b7810ff-1524-41f4-b17c-ba8df192fa16"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.7142857142857143, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=52b294f9-c1a0-4c48-a883-eb6416cbab5f"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=44a4169a-a54a-41c8-bd84-7c47f2983ca2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8214285714285714, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/bfad2eb6-c919-45ef-b6c7-df38acbf0848"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4515d151-c655-4661-9fbf-00f29f58efd4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4c9f356a-9c54-4be8-9490-c2b26902c587"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6071428571428571, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.717391304347826, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e73bff0b-4933-4eb6-9107-d8852c1f65c2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0df70012-ba75-4619-8f00-d626dfdbf533"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dab0e87e-9774-44f6-97d6-1a6a857f3e11"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b0bce2a8-384f-4e96-bff3-335b87503bf5"], "isController": false}, {"data": [0.6944444444444444, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5841485f-a628-4bc6-a1d5-883811b395f3"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.2916666666666667, 500, 1500, "register"], "isController": true}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9ac43d62-1279-46d4-ac07-865421deedd1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/52b294f9-c1a0-4c48-a883-eb6416cbab5f"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9b7810ff-1524-41f4-b17c-ba8df192fa16"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/88ef6801-2580-46d6-82d3-f5bfe0fa7c01"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/44a4169a-a54a-41c8-bd84-7c47f2983ca2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/bbbcbea7-0858-49e7-8f29-9012d058b6a4"], "isController": false}, {"data": [0.39814814814814814, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2916666666666667, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4515d151-c655-4661-9fbf-00f29f58efd4"], "isController": false}, {"data": [0.32608695652173914, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/095b8517-bf59-450e-9cad-8bd9023e4eab"], "isController": false}, {"data": [0.25862068965517243, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e73bff0b-4933-4eb6-9107-d8852c1f65c2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4c9f356a-9c54-4be8-9490-c2b26902c587"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.48148148148148145, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9147058823529411, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5841485f-a628-4bc6-a1d5-883811b395f3"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/dab0e87e-9774-44f6-97d6-1a6a857f3e11"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0df70012-ba75-4619-8f00-d626dfdbf533"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9ac43d62-1279-46d4-ac07-865421deedd1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1293, 27, 2.0881670533642693, 387.4648105181746, 108, 2406, 129.0, 1076.6000000000001, 1283.0, 1691.1799999999998, 5.102282413107302, 711.4046712594114, 3.7344837330219876], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 54, 0, 0.0, 1858.037037037037, 1365, 2488, 1823.0, 2161.5, 2317.5, 2488.0, 0.2574923109934912, 309.84868973964666, 1.2660876814963165], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b0bce2a8-384f-4e96-bff3-335b87503bf5", 1, 0, 0.0, 917.0, 917, 917, 917.0, 917.0, 917.0, 917.0, 1.0905125408942202, 0.19701642584514723, 0.7518572791712105], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=095b8517-bf59-450e-9cad-8bd9023e4eab", 1, 0, 0.0, 583.0, 583, 583, 583.0, 583.0, 583.0, 583.0, 1.7152658662092624, 0.3098868996569468, 1.182595411663808], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9b7810ff-1524-41f4-b17c-ba8df192fa16", 1, 0, 0.0, 428.0, 428, 428, 428.0, 428.0, 428.0, 428.0, 2.336448598130841, 0.4221122955607477, 1.6108717873831777], "isController": false}, {"data": ["deleteBook", 14, 2, 14.285714285714286, 480.7142857142857, 127, 860, 466.5, 855.5, 860.0, 860.0, 0.09671647565162726, 0.01905185039342881, 0.06507583176169061], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, 14.285714285714286, 480.7142857142857, 127, 860, 466.5, 855.5, 860.0, 860.0, 0.09603512141583206, 0.0189176327342571, 0.06461738149951983], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=52b294f9-c1a0-4c48-a883-eb6416cbab5f", 1, 0, 0.0, 614.0, 614, 614, 614.0, 614.0, 614.0, 614.0, 1.6286644951140066, 0.2942411441368078, 1.1228878257328991], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=44a4169a-a54a-41c8-bd84-7c47f2983ca2", 1, 0, 0.0, 1036.0, 1036, 1036, 1036.0, 1036.0, 1036.0, 1036.0, 0.9652509652509653, 0.1743861607142857, 0.6654952944015444], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 14, 0, 0.0, 144.71428571428572, 108, 341, 114.0, 333.5, 341.0, 341.0, 0.08900417048113111, 0.03336414705396196, 0.050226265289645], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 14, 0, 0.0, 145.78571428571428, 112, 326, 115.5, 325.0, 326.0, 326.0, 0.08900360464598817, 0.06614428040585643, 0.04467563748831828], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 14, 0, 0.0, 276.1428571428571, 109, 852, 322.5, 598.0, 852.0, 852.0, 0.08887421758947729, 1.8888126999669894, 0.05178956569074311], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 14, 0, 0.0, 189.64285714285717, 109, 961, 113.5, 651.0, 961.0, 961.0, 0.08900699976476721, 5.742894787765988, 0.051780020789492086], "isController": false}, {"data": ["goToProfile", 14, 2, 14.285714285714286, 274.64285714285717, 114, 1042, 218.0, 667.0, 1042.0, 1042.0, 0.09644530173601544, 0.20089631699503996, 0.062336925633783416], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/bfad2eb6-c919-45ef-b6c7-df38acbf0848", 1, 0, 0.0, 302.0, 302, 302, 302.0, 302.0, 302.0, 302.0, 3.3112582781456954, 1.0574037665562914, 1.9757605546357617], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4515d151-c655-4661-9fbf-00f29f58efd4", 3, 0, 0.0, 322.3333333333333, 213, 535, 219.0, 535.0, 535.0, 535.0, 0.019261884582787582, 0.026554062893263477, 0.012352185100290214], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 141.93749999999997, 110, 342, 115.5, 332.90000000000003, 342.0, 342.0, 0.08352387216671366, 0.06207194015514559, 0.04192506864618244], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 169.375, 109, 361, 115.0, 348.40000000000003, 361.0, 361.0, 0.08352648833761407, 0.02234986113721314, 0.04763620038004552], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 8, 0, 0.0, 797.625, 675, 902, 858.5, 902.0, 902.0, 902.0, 0.1032258064516129, 30.351814516129032, 0.05887096774193548], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 8, 0, 0.0, 1149.0, 969, 1297, 1179.0, 1297.0, 1297.0, 1297.0, 0.10278284554307887, 92.48418509263304, 0.0585179677261865], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4c9f356a-9c54-4be8-9490-c2b26902c587", 1, 0, 0.0, 482.0, 482, 482, 482.0, 482.0, 482.0, 482.0, 2.074688796680498, 0.3748217064315353, 1.4304006742738589], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 8, 0, 0.0, 254.125, 108, 343, 333.5, 343.0, 343.0, 343.0, 0.10397982791338481, 0.1839955548623567, 0.05757476799500896], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 10, 0, 0.0, 145.8, 110, 420, 115.5, 390.5000000000001, 420.0, 420.0, 0.057028149094392994, 0.04238127095784479, 0.028625457650896483], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 10, 0, 0.0, 157.89999999999998, 110, 340, 114.5, 338.5, 340.0, 340.0, 0.057054178648044185, 0.015266450146058697, 0.0325387112602127], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 10, 0, 0.0, 134.5, 109, 341, 112.0, 318.5000000000001, 341.0, 341.0, 0.057128167042760435, 0.015397826273244025, 0.03358511382787283], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 10, 0, 0.0, 257.09999999999997, 108, 437, 325.5, 428.0, 437.0, 437.0, 0.057053527619612715, 0.01537770861622374, 0.033596950346314915], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 8, 0, 0.0, 113.5, 109, 116, 114.5, 116.0, 116.0, 116.0, 0.10398253093480295, 0.07727608011854008, 0.05838862821046064], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 18, 0, 0.0, 701.2777777777777, 109, 1298, 960.0, 1282.7, 1298.0, 1298.0, 0.09209375143896487, 46.047765079712256, 0.04974421600077768], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 163.4375, 109, 439, 116.0, 371.80000000000007, 439.0, 439.0, 0.0835260522977495, 0.022512881283377795, 0.04910418308910664], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 18, 0, 0.0, 522.1666666666666, 108, 1017, 679.5, 922.5000000000001, 1017.0, 1017.0, 0.092093280260317, 15.054633219325263, 0.04983389633878048], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 142.31250000000003, 108, 340, 115.0, 335.8, 340.0, 340.0, 0.08352343615416338, 0.02251217615092685, 0.049184210938438014], "isController": false}, {"data": ["deleteBooks", 14, 2, 14.285714285714286, 582.2142857142857, 117, 1246, 524.0, 1141.0, 1246.0, 1246.0, 0.09565455042361301, 0.018842665345722872, 0.06497516824952172], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 10, 0, 0.0, 405.7, 220, 762, 448.5, 741.2, 762.0, 762.0, 0.05691681607330886, 0.08820994834798941, 0.12800725333674834], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 527.7391304347826, 139, 1566, 521.0, 1154.2000000000007, 1525.7999999999995, 1566.0, 0.09698462161239042, 0.05957356151776716, 0.04385144512357106], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 18, 0, 0.0, 126.88888888888889, 109, 327, 116.0, 141.6000000000003, 327.0, 327.0, 0.09209186675330124, 0.06843936581959204, 0.046225800303903164], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 18, 0, 0.0, 212.38888888888889, 109, 345, 119.0, 341.4, 345.0, 345.0, 0.0920951650038373, 0.10148855205935023, 0.04822604886160144], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e73bff0b-4933-4eb6-9107-d8852c1f65c2", 3, 0, 0.0, 333.0, 210, 570, 219.0, 570.0, 570.0, 570.0, 0.029190546155118565, 0.02433495726017534, 0.018719197892442568], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0df70012-ba75-4619-8f00-d626dfdbf533", 1, 0, 0.0, 410.0, 410, 410, 410.0, 410.0, 410.0, 410.0, 2.4390243902439024, 0.4406440548780488, 1.681592987804878], "isController": false}, {"data": ["login", 23, 0, 0.0, 2617.5652173913045, 1562, 5126, 2227.0, 3995.400000000001, 4961.399999999998, 5126.0, 0.09502797127676277, 39.670474047551174, 0.19818609549691366], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 117.375, 111, 124, 118.5, 122.6, 124.0, 124.0, 0.08470045155928237, 0.06857097103773935, 0.030108363640213655], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dab0e87e-9774-44f6-97d6-1a6a857f3e11", 1, 0, 0.0, 774.0, 774, 774, 774.0, 774.0, 774.0, 774.0, 1.2919896640826873, 0.23341610142118863, 0.890766311369509], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b0bce2a8-384f-4e96-bff3-335b87503bf5", 3, 0, 0.0, 535.3333333333333, 208, 1182, 216.0, 1182.0, 1182.0, 1182.0, 0.02703896314589323, 0.027294213774549127, 0.017339439256969295], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 0, 0.0, 830.3333333333333, 227, 1417, 1077.0, 1395.4, 1417.0, 1417.0, 0.09203677380428892, 61.23449436019102, 0.19391037727407529], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5841485f-a628-4bc6-a1d5-883811b395f3", 3, 0, 0.0, 603.6666666666666, 315, 1042, 454.0, 1042.0, 1042.0, 1042.0, 0.03064007108496492, 0.02554336655227707, 0.01964874350175159], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 14, 0, 0.0, 448.35714285714283, 231, 1285, 442.0, 976.0, 1285.0, 1285.0, 0.08880881998452189, 7.716821133882468, 0.19811007694649904], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 12, 4, 33.333333333333336, 880.1666666666667, 114, 1412, 1130.5, 1411.4, 1412.0, 1412.0, 0.1539448364336113, 122.79476026298909, 0.2654195397690827], "isController": false}, {"data": ["register", 24, 8, 33.333333333333336, 992.7083333333333, 128, 1641, 1036.0, 1502.0, 1607.5, 1641.0, 0.09887203486887096, 0.030897510896522175, 0.04460828135685389], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 363.1875, 225, 686, 239.0, 676.2, 686.0, 686.0, 0.08347288957058414, 0.12936667553566117, 0.18773248504009307], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9ac43d62-1279-46d4-ac07-865421deedd1", 3, 0, 0.0, 323.3333333333333, 246, 432, 292.0, 432.0, 432.0, 432.0, 0.02415206137843865, 0.024222819370758295, 0.015488138318855515], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 124.86666666666666, 111, 189, 119.0, 153.60000000000002, 189.0, 189.0, 0.13157433072523772, 0.10214999309234764, 0.04677056287498684], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/52b294f9-c1a0-4c48-a883-eb6416cbab5f", 3, 0, 0.0, 744.0, 231, 1513, 488.0, 1513.0, 1513.0, 1513.0, 0.03376819261377067, 0.028151152761675353, 0.021654732893596425], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9b7810ff-1524-41f4-b17c-ba8df192fa16", 3, 0, 0.0, 351.6666666666667, 232, 539, 284.0, 539.0, 539.0, 539.0, 0.03789026977872083, 0.024359792582348185, 0.024298122221380215], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 406.3529411764706, 225, 1406, 245.0, 812.3999999999994, 1406.0, 1406.0, 0.09361388128658513, 6.724475246011773, 0.20913087255020732], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/88ef6801-2580-46d6-82d3-f5bfe0fa7c01", 1, 0, 0.0, 232.0, 232, 232, 232.0, 232.0, 232.0, 232.0, 4.310344827586206, 1.3764480064655171, 2.571895204741379], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 13, 0, 0.0, 130.46153846153848, 110, 342, 114.0, 251.5999999999999, 342.0, 342.0, 0.0740926500091191, 0.05506299478216761, 0.03719103721160861], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/44a4169a-a54a-41c8-bd84-7c47f2983ca2", 3, 0, 0.0, 345.6666666666667, 221, 527, 289.0, 527.0, 527.0, 527.0, 0.04868549172346641, 0.030285799050632913, 0.0312208394190198], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 13, 0, 0.0, 133.30769230769232, 108, 360, 115.0, 266.3999999999999, 360.0, 360.0, 0.07409602845287493, 0.019826476363366922, 0.04225789122703023], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 13, 0, 0.0, 165.15384615384613, 108, 546, 116.0, 464.79999999999995, 546.0, 546.0, 0.07409602845287493, 0.019971195168938943, 0.04356036047717842], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 13, 0, 0.0, 114.61538461538463, 109, 124, 115.0, 121.6, 124.0, 124.0, 0.0740934945911749, 0.019970512214027607, 0.04363122777195162], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 118.5, 117, 120, 118.5, 120.0, 120.0, 120.0, 0.17871503887052095, 0.052706974354391915, 0.11047521445804663], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bbbcbea7-0858-49e7-8f29-9012d058b6a4", 1, 0, 0.0, 337.0, 337, 337, 337.0, 337.0, 337.0, 337.0, 2.967359050445104, 0.947584384272997, 1.7705628709198813], "isController": false}, {"data": ["https://demoqa.com/books", 54, 0, 0.0, 1243.0555555555554, 860, 2021, 1172.5, 1690.5, 1844.75, 2021.0, 0.249415720580492, 298.3879127483765, 0.49249862013061996], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 8, 33.333333333333336, 992.7083333333333, 128, 1641, 1036.0, 1502.0, 1607.5, 1641.0, 0.0992691310228443, 0.03102160344463885, 0.044787439973197334], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 9, 0, 0.0, 160.77777777777777, 108, 341, 110.0, 341.0, 341.0, 341.0, 0.05488541145763456, 0.014793333556940564, 0.032320217879837534], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 9, 0, 0.0, 159.44444444444446, 109, 325, 114.0, 325.0, 325.0, 325.0, 0.05488440733987474, 0.014793062915825614, 0.03226602853379355], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 213.2, 109, 1176, 115.0, 674.4000000000003, 1176.0, 1176.0, 0.13320309031169522, 8.02393388964124, 0.0775457053103632], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 179.33333333333331, 108, 907, 114.0, 556.6000000000001, 907.0, 907.0, 0.13320309031169522, 2.644584323106296, 0.07767578645324572], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 9, 0, 0.0, 164.77777777777777, 108, 346, 115.0, 346.0, 346.0, 346.0, 0.05488407264211925, 0.014685777249942068, 0.03130107267870864], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 144.86666666666665, 109, 346, 115.0, 343.0, 346.0, 346.0, 0.13320309031169522, 0.09899174973359381, 0.06686170744161264], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 9, 0, 0.0, 189.88888888888889, 109, 348, 119.0, 348.0, 348.0, 348.0, 0.05480753420903593, 0.040730989778394865, 0.02751081306976999], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 142.33333333333334, 109, 338, 114.0, 338.0, 338.0, 338.0, 0.13320545609548168, 0.04898075625177607, 0.07522292488100313], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 9, 0, 0.0, 170.77777777777777, 115, 346, 117.0, 346.0, 346.0, 346.0, 0.05519136071233649, 0.043441637435686735, 0.019618804003213364], "isController": false}, {"data": ["deleteAccount", 14, 2, 14.285714285714286, 485.6428571428571, 114, 1182, 475.0, 879.5, 1182.0, 1182.0, 0.09414992703380655, 0.01817850153666131, 0.06407133706346377], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4515d151-c655-4661-9fbf-00f29f58efd4", 1, 0, 0.0, 566.0, 566, 566, 566.0, 566.0, 566.0, 566.0, 1.7667844522968197, 0.31919445671378094, 1.2181150618374559], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1405.3478260869567, 757, 2406, 1207.0, 2292.2000000000003, 2402.2, 2406.0, 0.0957858395212374, 0.04957665522095295, 0.0440577445454129], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 0, 0.0, 381.3333333333333, 225, 687, 236.0, 687.0, 687.0, 687.0, 0.05476884504676651, 0.0848810127824399, 0.12317641615498366], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/095b8517-bf59-450e-9cad-8bd9023e4eab", 3, 0, 0.0, 332.0, 194, 577, 225.0, 577.0, 577.0, 577.0, 0.02139937656482941, 0.025293338641567575, 0.013722907497628235], "isController": false}, {"data": ["addBook", 58, 11, 18.96551724137931, 1139.2068965517237, 575, 2791, 926.5, 1887.2, 2041.4999999999989, 2791.0, 0.2770413890282057, 75.35248236398701, 1.0094154516252298], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e73bff0b-4933-4eb6-9107-d8852c1f65c2", 1, 0, 0.0, 420.0, 420, 420, 420.0, 420.0, 420.0, 420.0, 2.3809523809523814, 0.43015252976190477, 1.6415550595238095], "isController": false}, {"data": ["https://demoqa.com/books-0", 54, 0, 0.0, 194.48148148148144, 109, 470, 117.0, 443.0, 461.5, 470.0, 0.25072547881601853, 0.18633016540917005, 0.12120030470110273], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4c9f356a-9c54-4be8-9490-c2b26902c587", 3, 0, 0.0, 316.6666666666667, 202, 427, 321.0, 427.0, 427.0, 427.0, 0.017945696322926825, 0.02473959112226403, 0.011508145102918569], "isController": false}, {"data": ["https://demoqa.com/books-3", 54, 0, 0.0, 720.3148148148147, 540, 1077, 679.0, 908.5, 986.25, 1077.0, 0.2503082499745056, 73.59893650861709, 0.12588744993835], "isController": false}, {"data": ["https://demoqa.com/books-1", 54, 0, 0.0, 162.79629629629628, 108, 468, 116.0, 339.0, 415.25, 468.0, 0.2511674635807178, 0.444448675789317, 0.12214980162421626], "isController": false}, {"data": ["https://demoqa.com/books-2", 54, 0, 0.0, 1046.5740740740741, 744, 1574, 1021.5, 1288.5, 1402.0, 1574.0, 0.24999768520661844, 224.9483565979713, 0.1254871193322284], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 120.94117647058823, 111, 133, 119.0, 131.4, 133.0, 133.0, 0.08989001692047378, 0.06715416303140863, 0.03195309195219966], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 11, 6.470588235294118, 196.92352941176478, 110, 2301, 119.0, 300.8, 395.0999999999998, 2053.9199999999973, 0.7092760794556098, 1.4958888389672105, 0.3414450483142176], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 13, 0, 0.0, 164.23076923076923, 110, 475, 118.0, 423.4, 475.0, 475.0, 0.07551202964718456, 0.058477577646696643, 0.02684216678864764], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 14, 0, 0.0, 119.64285714285715, 112, 143, 117.5, 137.5, 143.0, 143.0, 0.08672328458245836, 0.07037797801564737, 0.030827417566420746], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 13, 0, 0.0, 300.23076923076917, 226, 702, 231.0, 686.0, 702.0, 702.0, 0.07404411890346356, 0.11475392255839519, 0.16652695882292634], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5841485f-a628-4bc6-a1d5-883811b395f3", 1, 0, 0.0, 438.0, 438, 438, 438.0, 438.0, 438.0, 438.0, 2.28310502283105, 0.4124750285388128, 1.574093892694064], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 376.0, 224, 1517, 233.0, 1017.8000000000003, 1517.0, 1517.0, 0.1330660184873055, 10.80535920617249, 0.29699884842449836], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dab0e87e-9774-44f6-97d6-1a6a857f3e11", 3, 0, 0.0, 295.6666666666667, 208, 462, 217.0, 462.0, 462.0, 462.0, 0.02568911038610733, 0.030363658792954332, 0.016473811022340964], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 10, 0, 0.0, 118.0, 111, 123, 118.0, 122.9, 123.0, 123.0, 0.05675980951407927, 0.047059646755325486, 0.020176338538207866], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 138.77777777777777, 110, 352, 121.5, 207.10000000000022, 352.0, 352.0, 0.09265502988124713, 0.0719343249566323, 0.032935967653099564], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0df70012-ba75-4619-8f00-d626dfdbf533", 3, 0, 0.0, 481.3333333333333, 219, 849, 376.0, 849.0, 849.0, 849.0, 0.048226859145420055, 0.031005223571681187, 0.030926729334790855], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 126.82352941176472, 109, 324, 116.0, 162.39999999999986, 324.0, 324.0, 0.0937899986759059, 0.06970135643785585, 0.04707818292911683], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9ac43d62-1279-46d4-ac07-865421deedd1", 1, 0, 0.0, 1246.0, 1246, 1246, 1246.0, 1246.0, 1246.0, 1246.0, 0.8025682182985554, 0.14499523475120385, 0.5533331661316212], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 178.41176470588235, 108, 342, 115.0, 342.0, 342.0, 342.0, 0.0937884463668011, 0.03338196310252181, 0.05302538425678174], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 234.41176470588235, 108, 1289, 116.0, 532.9999999999993, 1289.0, 1289.0, 0.09367113716760521, 4.981730038749546, 0.05459486200037469], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 221.05882352941177, 108, 568, 118.0, 388.79999999999984, 568.0, 568.0, 0.093674750246585, 1.6439681898456568, 0.054688447079276385], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 29.62962962962963, 0.6187161639597835], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 7.407407407407407, 0.15467904098994587], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 7.407407407407407, 0.15467904098994587], "isController": false}, {"data": ["401/Unauthorized", 15, 55.55555555555556, 1.160092807424594], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1293, 27, "401/Unauthorized", 15, "406/Not Acceptable", 8, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 12, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 11, "401/Unauthorized", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
