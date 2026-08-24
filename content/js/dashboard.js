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

    var data = {"OkPercent": 97.48520710059172, "KoPercent": 2.514792899408284};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7537926675094817, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.13559322033898305, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a4234da3-0872-4b01-9735-0d5ecf3f5d2d"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d069c200-235c-450a-8485-41f0c6c8fe0e"], "isController": false}, {"data": [0.5, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ad758b93-c84c-4470-8eb9-1ec6796ec947"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.7647058823529411, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/564601ef-70f2-4bde-a4ed-148ed13fc51c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=46619455-992a-420c-ab1e-338191b8a8ee"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7a046b08-1828-4f95-912e-ba0885f8a474"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/52c49673-1dda-4a29-9eee-9e2778cecc60"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.625, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.6086956521739131, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fcb791ca-33e6-43c8-9648-8e994c01c47f"], "isController": false}, {"data": [0.5714285714285714, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=91944b00-a84a-4054-9dba-43c2cbb23562"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=60238dbe-d320-4477-a340-fd188368eab2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=510ccb26-260c-440d-9b2b-801c41ca0b88"], "isController": false}, {"data": [0.8823529411764706, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.21428571428571427, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a1c33b90-a8d4-4dbc-9004-b5c36c8bd4de"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b0452770-eb1b-48c5-87ce-0c08f610e7ef"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=91637986-7468-4ba7-8ba1-d5bdfd0e0543"], "isController": false}, {"data": [0.12, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/60238dbe-d320-4477-a340-fd188368eab2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.4152542372881356, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.12, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/46619455-992a-420c-ab1e-338191b8a8ee"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d069c200-235c-450a-8485-41f0c6c8fe0e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f63dad8f-948a-4161-95ea-010cf2263c62"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/ad758b93-c84c-4470-8eb9-1ec6796ec947"], "isController": false}, {"data": [0.1956521739130435, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.2543859649122807, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f8e1fb95-62c9-436a-bc0d-1fd16d71cea6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=52c49673-1dda-4a29-9eee-9e2778cecc60"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9075144508670521, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/510ccb26-260c-440d-9b2b-801c41ca0b88"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/fcb791ca-33e6-43c8-9648-8e994c01c47f"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/91944b00-a84a-4054-9dba-43c2cbb23562"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7a046b08-1828-4f95-912e-ba0885f8a474"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/f63dad8f-948a-4161-95ea-010cf2263c62"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=564601ef-70f2-4bde-a4ed-148ed13fc51c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b0452770-eb1b-48c5-87ce-0c08f610e7ef"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/91637986-7468-4ba7-8ba1-d5bdfd0e0543"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1352, 34, 2.514792899408284, 389.575443786982, 100, 3721, 122.0, 1105.7, 1346.8999999999987, 2063.2800000000007, 5.3723917872342115, 773.6231949948243, 3.9256992155990096], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 59, 0, 0.0, 1677.1694915254232, 1247, 2310, 1656.0, 2000.0, 2235.0, 2310.0, 0.25594752641899043, 307.9907973443275, 1.258491987812126], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/a4234da3-0872-4b01-9735-0d5ecf3f5d2d", 1, 0, 0.0, 251.0, 251, 251, 251.0, 251.0, 251.0, 251.0, 3.9840637450199203, 1.2722547310756973, 2.3772099103585655], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d069c200-235c-450a-8485-41f0c6c8fe0e", 1, 0, 0.0, 579.0, 579, 579, 579.0, 579.0, 579.0, 579.0, 1.7271157167530224, 0.31202774179620035, 1.1907653281519863], "isController": false}, {"data": ["deleteBook", 17, 4, 23.529411764705884, 612.7647058823529, 106, 1454, 508.0, 1375.6, 1454.0, 1454.0, 0.1010119015787566, 0.020964843773210454, 0.06751921454333708], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 17, 4, 23.529411764705884, 612.7647058823529, 106, 1454, 508.0, 1375.6, 1454.0, 1454.0, 0.09838475383555856, 0.020419583846959622, 0.06576315462032166], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ad758b93-c84c-4470-8eb9-1ec6796ec947", 1, 0, 0.0, 1223.0, 1223, 1223, 1223.0, 1223.0, 1223.0, 1223.0, 0.8176614881439085, 0.14772204619787407, 0.563739268192968], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 154.1764705882353, 101, 317, 104.0, 313.8, 317.0, 317.0, 0.07715278975410951, 0.04109378829274491, 0.04285773649599259], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 130.4705882352941, 103, 308, 105.0, 307.2, 308.0, 308.0, 0.07715138917883692, 0.057336139809662984, 0.038726380896408376], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 252.8235294117647, 101, 805, 106.0, 648.1999999999998, 805.0, 805.0, 0.07715278975410951, 4.02044570202231, 0.044262690215664736], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 281.23529411764713, 102, 1123, 103.0, 1035.0, 1123.0, 1123.0, 0.07715278975410951, 12.268104632514454, 0.04418734569442049], "isController": false}, {"data": ["goToProfile", 17, 4, 23.529411764705884, 222.7058823529412, 102, 397, 223.0, 336.99999999999994, 397.0, 397.0, 0.10086805864587597, 0.15863194172496248, 0.06518644644796098], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/564601ef-70f2-4bde-a4ed-148ed13fc51c", 3, 0, 0.0, 342.6666666666667, 245, 503, 280.0, 503.0, 503.0, 503.0, 0.031151677517834337, 0.025969871784887282, 0.019976824449913295], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=46619455-992a-420c-ab1e-338191b8a8ee", 1, 0, 0.0, 231.0, 231, 231, 231.0, 231.0, 231.0, 231.0, 4.329004329004329, 0.7820955086580086, 2.9846455627705626], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7a046b08-1828-4f95-912e-ba0885f8a474", 1, 0, 0.0, 488.0, 488, 488, 488.0, 488.0, 488.0, 488.0, 2.0491803278688527, 0.3702132428278689, 1.412813780737705], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 21, 0, 0.0, 125.19047619047619, 103, 307, 105.0, 271.8000000000001, 307.0, 307.0, 0.14412979917914648, 0.10711208708528366, 0.07234640310359501], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 21, 0, 0.0, 123.95238095238096, 101, 308, 104.0, 269.8000000000001, 307.9, 308.0, 0.14413276686868132, 0.04887537834851303, 0.0816242947789621], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 622.8571428571429, 508, 811, 606.0, 811.0, 811.0, 811.0, 0.08374708380690316, 24.624423304121553, 0.047762008733624454], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 1067.5714285714287, 704, 1209, 1110.0, 1209.0, 1209.0, 1209.0, 0.08355116315154987, 75.17948347104355, 0.0475686798021031], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 250.2857142857143, 107, 310, 306.0, 310.0, 310.0, 310.0, 0.08415079823042892, 0.1489074671811887, 0.04659521737954415], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/52c49673-1dda-4a29-9eee-9e2778cecc60", 3, 0, 0.0, 928.6666666666666, 255, 2076, 455.0, 2076.0, 2076.0, 2076.0, 0.01827964196274609, 0.025199962145908104, 0.011722296440953711], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 12, 0, 0.0, 105.25000000000001, 103, 111, 105.0, 109.5, 111.0, 111.0, 0.09492844768255927, 0.07054741082658945, 0.047649630965659634], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 12, 0, 0.0, 175.49999999999997, 103, 307, 106.5, 307.0, 307.0, 307.0, 0.09492994960801841, 0.0372828724616127, 0.05347535084527209], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 12, 0, 0.0, 233.5833333333333, 102, 1219, 104.5, 945.400000000001, 1219.0, 1219.0, 0.09493220258532033, 7.1418018255660325, 0.055129898897204245], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 12, 0, 0.0, 199.49999999999997, 103, 612, 104.0, 520.5000000000003, 612.0, 612.0, 0.09493145158100422, 2.3495379755472405, 0.05522216926277817], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 190.57142857142858, 102, 310, 104.0, 310.0, 310.0, 310.0, 0.08415484491464294, 0.06254085642582351, 0.0472549177987497], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 21, 0, 0.0, 187.14285714285714, 102, 1115, 104.0, 395.20000000000005, 1044.899999999999, 1115.0, 0.14393222848213183, 6.2041122315835295, 0.08402739938451838], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 14, 0, 0.0, 833.9285714285716, 101, 1427, 1012.0, 1426.0, 1427.0, 1427.0, 0.07959384398469524, 51.162329956990895, 0.041906691852433016], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 21, 0, 0.0, 176.2380952380952, 102, 913, 104.0, 390.4000000000001, 862.7999999999993, 913.0, 0.14393222848213183, 2.052225659175337, 0.08416795820139547], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 14, 0, 0.0, 553.8571428571429, 102, 923, 610.0, 871.5, 923.0, 923.0, 0.07959339147441073, 16.722629289515275, 0.04198418152409974], "isController": false}, {"data": ["deleteBooks", 16, 3, 18.75, 513.5625, 105, 1472, 470.0, 1297.7000000000003, 1472.0, 1472.0, 0.10172939979654119, 0.02055823014687182, 0.06877786630531536], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 12, 0, 0.0, 374.08333333333337, 207, 1324, 234.5, 1052.200000000001, 1324.0, 1324.0, 0.09484966328369535, 9.590846278830345, 0.21129676780012013], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 780.3478260869564, 213, 2319, 759.0, 1608.6000000000013, 2245.3999999999987, 2319.0, 0.1002056393991147, 0.06155209685746402, 0.04530782328299816], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 14, 0, 0.0, 104.0, 101, 107, 104.0, 106.0, 107.0, 107.0, 0.07959384398469524, 0.0591512844456573, 0.03995237871888023], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 14, 0, 0.0, 235.35714285714286, 103, 310, 308.0, 309.5, 310.0, 310.0, 0.07950118683914638, 0.10656353280559687, 0.040571336698883576], "isController": false}, {"data": ["login", 23, 0, 0.0, 3417.6521739130435, 1825, 5845, 3131.0, 4781.8, 5653.799999999997, 5845.0, 0.0986938088944577, 36.06861878148547, 0.19871599488723157], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 21, 0, 0.0, 125.57142857142857, 105, 308, 110.0, 204.40000000000006, 299.4999999999999, 308.0, 0.1430624910585943, 0.11581914559333466, 0.0508542448684847], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fcb791ca-33e6-43c8-9648-8e994c01c47f", 1, 0, 0.0, 711.0, 711, 711, 711.0, 711.0, 711.0, 711.0, 1.4064697609001406, 0.25409854078762306, 0.9696949718706048], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 14, 0, 0.0, 954.0000000000001, 208, 1536, 1117.5, 1531.5, 1536.0, 1536.0, 0.07945516458569807, 67.93232565976164, 0.16417556398978433], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=91944b00-a84a-4054-9dba-43c2cbb23562", 1, 0, 0.0, 217.0, 217, 217, 217.0, 217.0, 217.0, 217.0, 4.608294930875576, 0.8325532834101382, 3.1772033410138247], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=60238dbe-d320-4477-a340-fd188368eab2", 1, 0, 0.0, 619.0, 619, 619, 619.0, 619.0, 619.0, 619.0, 1.6155088852988693, 0.29186439822294025, 1.113817649434572], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=510ccb26-260c-440d-9b2b-801c41ca0b88", 1, 0, 0.0, 462.0, 462, 462, 462.0, 462.0, 462.0, 462.0, 2.1645021645021645, 0.3910477543290043, 1.4923227813852813], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 462.4705882352941, 208, 1306, 216.0, 1242.8, 1306.0, 1306.0, 0.07711464225610226, 16.37887890903194, 0.1699507841311675], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 14, 7, 50.0, 695.4285714285714, 102, 1517, 557.0, 1475.5, 1517.0, 1517.0, 0.1212215670485146, 72.52778693253154, 0.17668280158194144], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a1c33b90-a8d4-4dbc-9004-b5c36c8bd4de", 1, 0, 0.0, 344.0, 344, 344, 344.0, 344.0, 344.0, 344.0, 2.9069767441860463, 0.9283021438953489, 1.7345339752906979], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b0452770-eb1b-48c5-87ce-0c08f610e7ef", 3, 0, 0.0, 296.6666666666667, 213, 458, 219.0, 458.0, 458.0, 458.0, 0.03206738426346563, 0.03237010371126527, 0.020564045247079197], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=91637986-7468-4ba7-8ba1-d5bdfd0e0543", 1, 0, 0.0, 556.0, 556, 556, 556.0, 556.0, 556.0, 556.0, 1.7985611510791368, 0.32493536420863306, 1.2400236061151078], "isController": false}, {"data": ["register", 25, 8, 32.0, 1378.0399999999997, 247, 2389, 1413.0, 2223.8, 2350.6, 2389.0, 0.10599777828656712, 0.03317399217312405, 0.04782321637538477], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 13, 0, 0.0, 111.99999999999999, 104, 143, 107.0, 133.79999999999998, 143.0, 143.0, 0.06704763476574588, 0.05205358363160935, 0.02383333892063623], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 21, 0, 0.0, 342.3809523809524, 206, 1220, 211.0, 700.2, 1170.1999999999994, 1220.0, 0.14382773546654976, 8.40600343816777, 0.3217195825742425], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/60238dbe-d320-4477-a340-fd188368eab2", 3, 0, 0.0, 369.3333333333333, 250, 466, 392.0, 466.0, 466.0, 466.0, 0.04611837048424289, 0.029649668524212146, 0.029574606072252114], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 19, 0, 0.0, 264.1052631578948, 205, 416, 210.0, 414.0, 416.0, 416.0, 0.10635141867195065, 0.16482392718006417, 0.23918683320459216], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 12, 0, 0.0, 105.5, 103, 117, 105.0, 113.70000000000002, 117.0, 117.0, 0.061927493226680425, 0.04602228744678106, 0.031084698748548575], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 12, 0, 0.0, 153.83333333333331, 102, 308, 103.0, 307.7, 308.0, 308.0, 0.06192877159120819, 0.01657078458592875, 0.03531875254811092], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 12, 0, 0.0, 137.5, 101, 312, 103.5, 310.2, 312.0, 312.0, 0.061861728726009244, 0.01667366907068218, 0.03636793036431403], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 12, 0, 0.0, 153.83333333333331, 102, 309, 103.0, 308.4, 309.0, 309.0, 0.06192877159120819, 0.01669173921794283, 0.036467821552244664], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 109.0, 105, 112, 110.0, 112.0, 112.0, 112.0, 0.04118616144975288, 0.012146699958813838, 0.02545980488056013], "isController": false}, {"data": ["https://demoqa.com/books", 59, 0, 0.0, 1163.6610169491526, 810, 1837, 1124.0, 1571.0, 1725.0, 1837.0, 0.2578693869701658, 308.5014367203822, 0.5091913090367923], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 8, 32.0, 1378.0399999999997, 247, 2389, 1413.0, 2223.8, 2350.6, 2389.0, 0.104826198163445, 0.03280732420646568, 0.04729463237452304], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 103.625, 102, 105, 104.0, 105.0, 105.0, 105.0, 0.04531165925632239, 0.012212908158930644, 0.02668254934722891], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 103.12500000000001, 102, 104, 103.0, 104.0, 104.0, 104.0, 0.04531165925632239, 0.012212908158930644, 0.026638299679986405], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/46619455-992a-420c-ab1e-338191b8a8ee", 3, 0, 0.0, 514.3333333333334, 223, 744, 576.0, 744.0, 744.0, 744.0, 0.06826870562534133, 0.031689835358638264, 0.04377908531312579], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d069c200-235c-450a-8485-41f0c6c8fe0e", 3, 0, 0.0, 324.3333333333333, 220, 462, 291.0, 462.0, 462.0, 462.0, 0.030000300003000028, 0.024717044045440454, 0.01923847363473635], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 13, 0, 0.0, 120.38461538461539, 102, 317, 103.0, 234.99999999999994, 317.0, 317.0, 0.06711825203419933, 0.01809046636859279, 0.039458191137292965], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 13, 0, 0.0, 119.46153846153847, 101, 305, 104.0, 227.39999999999992, 305.0, 305.0, 0.067118598563662, 0.01809055976911202, 0.039523940365125174], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f63dad8f-948a-4161-95ea-010cf2263c62", 1, 0, 0.0, 1472.0, 1472, 1472, 1472.0, 1472.0, 1472.0, 1472.0, 0.6793478260869565, 0.12273373811141304, 0.4683784816576087], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 13, 0, 0.0, 104.76923076923076, 101, 114, 104.0, 111.2, 114.0, 114.0, 0.06711721246728036, 0.04987910028085972, 0.03368969453924034], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 103.12500000000001, 101, 104, 103.0, 104.0, 104.0, 104.0, 0.04531165925632239, 0.01212440882444564, 0.025841805669621364], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 13, 0, 0.0, 103.61538461538461, 100, 110, 103.0, 108.0, 110.0, 110.0, 0.06711894509670291, 0.017959561480953706, 0.03827877337546338], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 107.62500000000001, 103, 129, 105.0, 129.0, 129.0, 129.0, 0.045310889339480506, 0.03367342459701628, 0.02274394250048143], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 133.25, 105, 310, 107.0, 310.0, 310.0, 310.0, 0.044563528094519245, 0.035076370746271984, 0.015840941627348636], "isController": false}, {"data": ["deleteAccount", 16, 3, 18.75, 642.9374999999998, 103, 1851, 523.0, 1412.8000000000004, 1851.0, 1851.0, 0.09946042718253474, 0.01958977041736082, 0.0676809266759082], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/ad758b93-c84c-4470-8eb9-1ec6796ec947", 3, 0, 0.0, 1365.3333333333333, 397, 2954, 745.0, 2954.0, 2954.0, 2954.0, 0.0457268279299465, 0.0293979443885561, 0.02932351921288887], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1816.8695652173913, 1008, 3721, 1715.0, 3012.000000000002, 3667.999999999999, 3721.0, 0.09944225863634398, 0.05146913777076398, 0.04573955450949025], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 211.87500000000003, 207, 234, 209.0, 234.0, 234.0, 234.0, 0.045284215054737294, 0.07018168876158992, 0.10184526100689452], "isController": false}, {"data": ["addBook", 57, 12, 21.05263157894737, 1128.0, 523, 5366, 869.0, 1881.4000000000003, 2062.399999999999, 5366.0, 0.2732410705297521, 87.15022727395294, 0.9915709099526862], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/f8e1fb95-62c9-436a-bc0d-1fd16d71cea6", 1, 0, 0.0, 333.0, 333, 333, 333.0, 333.0, 333.0, 333.0, 3.003003003003003, 0.9589667792792792, 1.7918308933933933], "isController": false}, {"data": ["https://demoqa.com/books-0", 59, 0, 0.0, 181.91525423728814, 102, 428, 106.0, 415.0, 420.0, 428.0, 0.2586788961864593, 0.19224085937294483, 0.1250449742307591], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=52c49673-1dda-4a29-9eee-9e2778cecc60", 1, 0, 0.0, 478.0, 478, 478, 478.0, 478.0, 478.0, 478.0, 2.092050209205021, 0.377958289748954, 1.4423705543933054], "isController": false}, {"data": ["https://demoqa.com/books-3", 59, 0, 0.0, 681.542372881356, 504, 1029, 613.0, 914.0, 934.0, 1029.0, 0.25851115103185385, 76.01086178142664, 0.13001293240371556], "isController": false}, {"data": ["https://demoqa.com/books-1", 59, 0, 0.0, 158.01694915254242, 101, 312, 107.0, 310.0, 312.0, 312.0, 0.25908100892292557, 0.45845194157064567, 0.12599838129259466], "isController": false}, {"data": ["https://demoqa.com/books-2", 59, 0, 0.0, 977.0169491525422, 704, 1426, 914.0, 1219.0, 1419.0, 1426.0, 0.2583900112552937, 232.49978632870494, 0.12969967361837986], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 19, 0, 0.0, 121.7894736842105, 105, 311, 110.0, 122.0, 311.0, 311.0, 0.10732159197460432, 0.08017677525446514, 0.03814947214722263], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 173, 12, 6.936416184971098, 195.14450867052017, 103, 3574, 112.0, 314.4, 437.49999999999955, 2219.7999999999834, 0.753746950156849, 1.739304104762112, 0.357990657132276], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 12, 0, 0.0, 110.33333333333333, 106, 125, 109.0, 121.70000000000002, 125.0, 125.0, 0.06288220590778323, 0.048696864536007925, 0.022352659131282326], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 134.17647058823528, 105, 310, 110.0, 306.8, 310.0, 310.0, 0.079644690978599, 0.0646335334015779, 0.028311198746298862], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/510ccb26-260c-440d-9b2b-801c41ca0b88", 3, 0, 0.0, 800.3333333333334, 228, 1851, 322.0, 1851.0, 1851.0, 1851.0, 0.02040455429651898, 0.02411749239930352, 0.013084951811244269], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fcb791ca-33e6-43c8-9648-8e994c01c47f", 3, 0, 0.0, 456.33333333333337, 315, 733, 321.0, 733.0, 733.0, 733.0, 0.04501800720288115, 0.028942240958883553, 0.028868969462785114], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/91944b00-a84a-4054-9dba-43c2cbb23562", 3, 0, 0.0, 405.6666666666667, 211, 543, 463.0, 543.0, 543.0, 543.0, 0.08228872370189538, 0.03723350453959459, 0.05276978700935348], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 12, 0, 0.0, 311.75000000000006, 207, 422, 311.5, 420.2, 422.0, 422.0, 0.06182762458266353, 0.09582074239520218, 0.13905177677136143], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7a046b08-1828-4f95-912e-ba0885f8a474", 3, 0, 0.0, 567.0, 195, 1225, 281.0, 1225.0, 1225.0, 1225.0, 0.03145610300825198, 0.03154825956003397, 0.02017204522339076], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f63dad8f-948a-4161-95ea-010cf2263c62", 3, 0, 0.0, 665.0, 231, 1173, 591.0, 1173.0, 1173.0, 1173.0, 0.04533708119871243, 0.029147374794094086, 0.029073583971830557], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 13, 0, 0.0, 241.92307692307693, 205, 421, 209.0, 420.6, 421.0, 421.0, 0.067081194045254, 0.10396274897443175, 0.1508671776232617], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=564601ef-70f2-4bde-a4ed-148ed13fc51c", 1, 0, 0.0, 417.0, 417, 417, 417.0, 417.0, 417.0, 417.0, 2.398081534772182, 0.43324715227817745, 1.6533648081534773], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 12, 0, 0.0, 125.33333333333333, 104, 310, 107.5, 252.4000000000002, 310.0, 310.0, 0.09794079478954971, 0.08120286599250753, 0.034814891897847755], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 14, 0, 0.0, 125.35714285714288, 105, 313, 110.0, 218.0, 313.0, 313.0, 0.07690406218242743, 0.05970579046389629, 0.02733699085390975], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b0452770-eb1b-48c5-87ce-0c08f610e7ef", 1, 0, 0.0, 437.0, 437, 437, 437.0, 437.0, 437.0, 437.0, 2.288329519450801, 0.41341890732265446, 1.577695938215103], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/91637986-7468-4ba7-8ba1-d5bdfd0e0543", 3, 0, 0.0, 390.6666666666667, 264, 583, 325.0, 583.0, 583.0, 583.0, 0.025997434919754585, 0.026073599279871053, 0.016671532158826996], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 19, 0, 0.0, 104.21052631578947, 102, 114, 104.0, 105.0, 114.0, 114.0, 0.10641396151175035, 0.07908303194379103, 0.05341482052445281], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 19, 0, 0.0, 136.42105263157893, 103, 309, 103.0, 307.0, 309.0, 309.0, 0.10641396151175035, 0.02847404829513632, 0.06068921242467012], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 19, 0, 0.0, 125.89473684210527, 101, 309, 103.0, 307.0, 309.0, 309.0, 0.10641455751146756, 0.028682048704262744, 0.06256012072451511], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 19, 0, 0.0, 136.68421052631578, 101, 312, 103.0, 308.0, 312.0, 312.0, 0.10641455751146756, 0.028682048704262744, 0.06266404119083491], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 23.529411764705884, 0.591715976331361], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 4, 11.764705882352942, 0.2958579881656805], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 8.823529411764707, 0.22189349112426035], "isController": false}, {"data": ["401/Unauthorized", 19, 55.88235294117647, 1.4053254437869822], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1352, 34, "401/Unauthorized", 19, "406/Not Acceptable", 8, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 17, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 14, 7, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 173, 12, "401/Unauthorized", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
